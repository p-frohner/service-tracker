-- name: ListVehicles :many
SELECT * FROM vehicles
ORDER BY created_at DESC;

-- name: GetVehicle :one
SELECT * FROM vehicles
WHERE id = $1 LIMIT 1;

-- name: CreateVehicle :one
INSERT INTO vehicles (make, model, year)
VALUES ($1, $2, $3)
RETURNING *;

-- name: UpdateVehicle :one
UPDATE vehicles
SET make = $2, model = $3, year = $4
WHERE id = $1
RETURNING *;

-- name: DeleteVehicle :exec
DELETE FROM vehicles
WHERE id = $1;

-- name: CreateMaintenanceRecord :one
INSERT INTO maintenance_records (vehicle_id, date, description, mileage, cost, notes)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;