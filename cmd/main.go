package main

import convolvr "github.com/convolvr/server"

const configName = "config"

func main() {
	convolvr.Start(configName)
}
