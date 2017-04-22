package convolvr

type ToolAction struct {
  World       string      `json:"world"`
  User        string      `json:"user"`
  UserId      int         `json:"userId"`
  Coords      []int       `json:"coords"`
  Position    []float64   `json:"position"`
  Quaternion  []float64   `json:"quaternion"`
  Tool        string      `json:"tool"`
  Hand        int         `json:"hand"`
  Options     interface{} `json:"options"`
  Components  []Component `storm:"inline" json:"components"`
  Entity      Entity      `json:"entity"`
  EntityId    int         `json:"entityId"`
  Primary     bool        `json:"primary"`
}
