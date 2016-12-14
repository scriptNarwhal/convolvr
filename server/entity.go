package server

import (
  "github.com/SpaceHexagon/convolvr/server"
)

type Entity struct {
  Name string `json:"name"`
  World string `json:"world"`
  Position []int `json:"position"`
  Quaternion []int `json:"quaternion"`
  Components []*server.Component `json:"components"`
}

func NewEntity (name string, world string, components []*server.Component, pos []int, quat []int) *entity {
  return &entity{name, world, components, pos, quat}
}
