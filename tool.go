package convolvr

type ToolAction struct {
  World       string      `json:"world"`
  User        string      `json:"user"`
  UserId      int         `json:"userId"`
  Coords      []int       `json:"coords"`
  Position    []float64   `json:"position"`
  Quaternion  []float64   `json:"quaternion"`
  Tool        string      `json:"tool"`
  Options     interface{} `json:"options"`
  Entity      Entity    `json:"entity"`
  Primary     bool        `json:"primary"`
}