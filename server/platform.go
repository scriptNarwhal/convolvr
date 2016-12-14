package server

import (
  "github.com/SpaceHexagon/convolvr/server"
)

type Platform struct {
  Name string `json:"name"`
  Geometry string `json:"geometry"`
  Material string `json:"material"`
  Position []int `json:"position"`
  Cell []int `json:"cell"`
  Structures []*Structure `json:"structures"`
  Voxels []*Voxel `json:"voxels"`
  Entities []*Entity `json:"entities"`
}

func NewPlatform (name string, geom string, mat string, pos []int, cell []int, structures []*Structure, voxels []*Voxel, entities []*Entity) *platform {
  return &platform{name, geom, mat, pos, cell, structures, voxels, entities}
}
