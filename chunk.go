package convolvr

type Chunk struct {
  ID int
  x int `storm:"index" json:"x"`
  y int `storm:"index" json:"y"`
  z int `storm:"index" json:"z"`
  Name string `json:"name"`
  Geometry string `json:"geometry"`
  Material string `json:"material"`
  Position []int `json:"position"`
  Structures []*Structure `json:"structures"`
  Voxels []*Voxel `json:"voxels"`
  Entities []*Entity `json:"entities"`
}

func NewChunk (id, x int, y int, z int, name string, geom string, mat string, pos []int, structures []*Structure, voxels []*Voxel, entities []*Entity) *Chunk {
  return &Chunk{id, x, y, z, name, geom, mat, pos, structures, voxels, entities}
}
