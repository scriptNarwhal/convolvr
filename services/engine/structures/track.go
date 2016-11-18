package structures

import (
	"github.com/SpaceHexagon/convolvr/services/engine/types"
  "github.com/SpaceHexagon/convolvr/services/engine/voxels"
	"github.com/pborman/uuid"
)

type Track struct {
	Id         string                  `json:"id"`
  Aspects    []*types.Aspect         `json:"aspects"`
	Voxels     []*voxels.Voxel         `json:"voxels"`
	Position   *types.Position         `json:"pos"`
  Quaternion *types.Quaternion       `json:"quat"`
}

func NewTrack(position *types.Position, voxels []*voxels.Voxel, aspects []*types.Aspect) *Track { // components []*components.Voxel
	return &Track{
		Id:         uuid.NewUUID().String(),
		Voxels:     voxels,
		Position:   position,
		Quaternion: &types.Quaternion{},
	}
}

func (e *Track) Update(p *types.Position, q *types.Quaternion) {
	e.Position.X = p.X
	e.Position.Y = p.Y
	e.Position.Z = p.Z
	e.Quaternion.X = q.X
	e.Quaternion.Y = q.Y
	e.Quaternion.Z = q.Z
	e.Quaternion.W = q.W
}
