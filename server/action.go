package convolvr

import (
	core "github.com/Convolvr/core"
)

type ToolAction struct {
	World         string      	   `json:"world"`
	User          string      	   `json:"user"`
	UserID        int         	   `json:"userId"`
	Coords        []int       	   `json:"coords"`
	Position      []float64   	   `json:"position"`
	Quaternion    []float64   	   `json:"quaternion"`
	Tool          string      	   `json:"tool"`
	Hand          int         	   `json:"hand"`
	Options       interface{} 	   `json:"options"`
	Components    []core.Component `storm:"inline" json:"components"`
	Entity        core.Entity      `json:"entity"`
	EntityID      int         	   `json:"entityId"`
	ComponentID   int         	   `json:"componentId"`
	ComponentPath []int       	   `json:"componentPath"`
	Primary       bool        	   `json:"primary"`
}
