package voxels

import (
	"github.com/SpaceHexagon/convolvr/services/engine/types"
	"github.com/pborman/uuid"
)

type Voxel struct {
	Id            string            `json:"id"`
	VoxelType     string            `json:"type"`
	Position      *types.Position   `json:"pos"`
}

func NewVoxel(voxelType string, p *types.Position, q *types.Quaternion) *Voxel {
	return &Voxel{
		Id:            uuid.NewUUID().String(),
		VoxelType:     voxelType,
		Position:      &types.Position{X: p.X, Y: p.Y, Z: p.Z}
	}
}

func (e *Voxel) Update(p *types.Position) {
	e.Position.X = p.X
	e.Position.Y = p.Y
	e.Position.Z = p.Z
}
