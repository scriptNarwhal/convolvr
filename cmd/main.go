package main

import convolvr "github.com/convolvr/convolvr/server"

const configName = "config"

func main() {
	convolvr.Start(configName)
}
