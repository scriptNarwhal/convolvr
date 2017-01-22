package convolvr

type Component struct {
	ID         int      `storm:"id,increment" json:"id"`
	Name       string   `json:"name"`
	Shape      string   `json:"shape"`
	Material   string   `json:"material"`
	Color      int       `json:"color"`
	Size			 []float64 `json:"size"`
	Position   []int    `json:"position"`
	Quaternion []int    `json:"quaternion"`
	ComponentType    string `json:"type"`
}

func NewComponent(id int, name string, shape string, mat string, color int, size []float64, pos []int, quat []int, componentType string) *Component {
	return &Component{id, name, shape, mat, color, size, pos, quat, componentType}
}
