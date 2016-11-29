package server

type Voxel struct {
  Cell []int `json:"cell"`
  Geometry string `json:"geometry"`
  Material string `json:"material"`
}

func NewVoxel (cell []int, geom string, mat string) {
  return &voxel{cell, geom, mat}
}
