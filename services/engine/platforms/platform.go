package platforms

import (
	"github.com/SpaceHexagon/convolvr/services/engine/types"
    "github.com/SpaceHexagon/convolvr/services/engine/voxels"
	"github.com/pborman/uuid"
)

type Platform struct {
	Id         string                  `json:"id"`
    Aspects    []*types.Aspect         `json:"aspects"`
	Voxels     []*voxels.Voxel         `json:"voxels"`
	Position   *types.Position         `json:"pos"`
}

func NewPlatform(position *types.Position, voxels []*voxels.Voxel, aspects []*types.Aspect) *Platform { // components []*components.Voxel
	return &Platform{
		Id:         uuid.NewUUID().String(),
        Aspects:    aspects,
		Voxels:     voxels,
		Position:   position
	}
}

func (e *Platform) Update(p *types.Position) {
	e.Position.X = p.X
	e.Position.Y = p.Y
	e.Position.Z = p.Z
}
