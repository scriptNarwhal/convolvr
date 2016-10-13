package towers

import (
	"github.com/SpaceHexagon/convolvr/services/engine/types"
    "github.com/SpaceHexagon/convolvr/services/engine/voxels"
	"github.com/pborman/uuid"
)

type Tower struct {
	Id         string                  `json:"id"`
    Floors     int                     `json:"floors"`
    Aspects    []*types.Aspect         `json:aspects`
	Voxels     []*voxels.Voxel         `json:"voxels"`
	Position   *types.Position         `json:"pos"`
}

func NewTower(floors int, position *types.Position, voxels []*voxels.Voxel, aspects []*types.Aspect) *Tower { // components []*components.Voxel
	return &Tower{
		Id:         uuid.NewUUID().String(),
        Aspects:    aspects,
        Floors:     floors,
		Voxels:     voxels,
		Position:   position
	}
}

func (e *Tower) Update(p *types.Position) {
	e.Position.X = p.X
	e.Position.Y = p.Y
	e.Position.Z = p.Z
}
