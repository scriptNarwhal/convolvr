package convolvr

type World struct {
	ID      int    `storm:"id,increment" json:"id"`
	Name    string `storm:"id" json:"name"`
	Sky     `storm:"inline" json:"sky"`
	Light   `storm:"inline" json:"light"`
	Terrain `storm:"inline" json:"terrain"`
	Spawn   `storm:"inline" json:"spawn"`
}

type Sky struct {
	SkyType string  `json:"skyType"`
	Color   int     `json:"color"`
	Layers  []Layer `storm:"inline"`
}

type Layer struct {
	Movement      []int   `json:"movement"`
	Opacity       float64 `json:"opacity"`
	Altitude      int     `json:"altitude"`
	Texture       string  `json:"texture"`
	CustomTexture string  `json:"texture"`
}

type Light struct {
	Color        int     `json:"color"`
	Intensity    float64 `json:"intensity"`
	Angle        float64 `json:"angle"`
	AmbientColor float64 `json:"ambientColor"`
}

type Terrain struct {
	TerrainType string  `json:"type"`
	Height      int     `json:"height"`
	Color       int     `json:"color"`
	Flatness    float64 `json:"flatness"`
	Decorations string  `json:"decorations"`
}

type Spawn struct {
	Entities   bool `json:"entities"`
	Structures bool `json:"structures"`
	NPCS       bool `json:"npcs"`
	Tools      bool `json:"tools"`
	Vehicles   bool `json:"vehicles"`
}

func NewWorld(id int, name string, sky Sky, light Light, terrain Terrain, spawn Spawn) *World {
	return &World{id, name, sky, light, terrain, spawn}
}
