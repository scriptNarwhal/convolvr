package server

import (
  "github.com/SpaceHexagon/convolvr/server"
)

type Structure struct {
  Name string `json:"name"`
  Geometry string `json:"geometry"`
  Material string `json:"material"`
  Entities []*Entity `json:"entities"`
  Voxels []*Voxel `json:"voxels"`
  Position []int `json:"position"`
  Quaternion []int `json:"quaternion"`
  Floors int `json:"floors"`
  Length int `json:"length"`
  Width int `json:"width"`
  Light int  `json:"light"` // hex color
}

func NewStructure (name string, geom string, mat string, Entities []*Entity, Voxels []*Voxel, pos []int, quat []int, length int, width int, floors int, light int ) {
  return &structure{name, geom, mat, entities, voxels, pos, quat, length, width, floors, light}
}
