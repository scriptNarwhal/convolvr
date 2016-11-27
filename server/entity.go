package server

import (
  "github.com/SpaceHexagon/convolvr/server/component"
)

type Entity struct {
  Name string `json:"name"`
  World string `json:"world"`
  Position []int `json:"position"`
  Quaternion []int `json:"quaternion"`
  Components []*Component `json:"components"`
}

func NewEntity (name string, world string, components []*Component, pos []int, quat []int) *entity {
  return &entity{name, world, components, pos, quat}
}
