package server

type Component struct {
  Name string `json:"name"`
  Geometry string `json:"geometry"`
  Material string `json:"material"`
  Position []int `json:"position"`
  Quaternion []int `json:"quaternion"`
  Aspects []string `json:"aspects"`
}

func NewComponent (name string, geom string, mat string, pos []int, quat []int, aspects []string) *component {
  return &component{name, geom, mat, pos, quat, aspects}
}
