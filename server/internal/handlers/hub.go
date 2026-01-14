package handlers

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

type Client struct {
	hub        *Hub
	conn       *websocket.Conn
	send       chan []byte
	vehicleIDs map[string]bool
	mu         sync.RWMutex
}

type ClientMessage struct {
	Action    string `json:"action"`
	VehicleID string `json:"vehicle_id"`
}

type BroadcastMessage struct {
	Type      string   `json:"type"`
	VehicleID string   `json:"vehicle_id"`
	URLs      []string `json:"urls,omitempty"`
}

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			var msg BroadcastMessage
			if err := json.Unmarshal(message, &msg); err != nil {
				log.Printf("Failed to parse broadcast message: %v", err)
				continue
			}

			// Collect slow clients to remove after iteration (avoids lock upgrade issues)
			var slowClients []*Client

			h.mu.RLock()
			for client := range h.clients {
				client.mu.RLock()
				subscribed := client.vehicleIDs[msg.VehicleID]
				client.mu.RUnlock()

				if subscribed {
					select {
					case client.send <- message:
					default:
						slowClients = append(slowClients, client)
					}
				}
			}
			h.mu.RUnlock()

			// Remove slow clients outside of iteration
			for _, client := range slowClients {
				h.unregister <- client
			}
		}
	}
}

func (c *Client) ReadPump() {
	defer func() {
		c.hub.unregister <- c
		c.conn.Close()
	}()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}

		var msg ClientMessage
		if err := json.Unmarshal(message, &msg); err != nil {
			log.Printf("Failed to parse client message: %v", err)
			continue
		}

		c.mu.Lock()
		switch msg.Action {
		case "subscribe":
			c.vehicleIDs[msg.VehicleID] = true
		case "unsubscribe":
			delete(c.vehicleIDs, msg.VehicleID)
		}
		c.mu.Unlock()
	}
}

func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
