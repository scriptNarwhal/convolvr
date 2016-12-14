package convolvr

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

func NewStructure (name string, geom string, mat string, entities []*Entity, voxels []*Voxel, pos []int, quat []int, length int, width int, floors int, light int ) *Structure {
  return &Structure{name, geom, mat, entities, voxels, pos, quat, length, width, floors, light}
}
