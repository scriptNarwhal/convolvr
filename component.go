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
	Aspects    []string `json:"aspects"`
}

func NewComponent(id int, name string, shape string, mat string, color int, size []float64, pos []int, quat []int, aspects []string) *Component {
	return &Component{id, name, shape, mat, color, size, pos, quat, aspects}
}
