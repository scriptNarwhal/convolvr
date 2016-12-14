package convolvr

type Entity struct {
  Name string `json:"name"`
  World string `json:"world"`
  Components []*Component `json:"components"`
  Position []int `json:"position"`
  Quaternion []int `json:"quaternion"`
}

func NewEntity (name string, world string, components []*Component, pos []int, quat []int) *Entity {
  return &Entity{name, world, components, pos, quat}
}
