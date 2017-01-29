package convolvr

import (
	"io"
	"os"
	"fmt"
  "log"
  "io/ioutil"
  "net/http"
  "github.com/labstack/echo"
)

func listFiles(c echo.Context) error { // Get /files/list
	files, _ := ioutil.ReadDir("./")
  for _, f := range files {
    log.Println(f.Name())
  }
	return c.JSON(http.StatusOK, nil)
}
func getFiles(c echo.Context) error { // Get /files/download/:dir/:filename
	return c.JSON(http.StatusOK, nil)
}
func postFiles(c echo.Context) error { // Post /files/upload
	file, err := c.FormFile("file") // Source
	username := c.Param("username")
	dir := c.Param("dir")
	log.Printf(`post files "%s" "%s"`, username, dir)
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close() // Destination
	createDataDir(username, dir)
	dst, err := os.Create("../web/data/"+username+"/"+dir+"/"+file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()
	if _, err = io.Copy(dst, src); err != nil { // Copy
		return err
	}
	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s uploaded successfully</p>", file.Filename))
}
func postMultipleFiles(c echo.Context) error {
	form, err := c.MultipartForm()
	username := c.Param("username")
	dir := c.Param("dir")
	if err != nil {
		return err
	}
	files := form.File["files"]
	for _, file := range files {
		src, err := file.Open() // Source
		if err != nil {
			return err
		}
		defer src.Close()
		createDataDir(username, dir)
		dst, err := os.Create("../web/data/"+username+"/"+dir+"/"+file.Filename) // Destination
		if err != nil {
			return err
		}
		defer dst.Close()
		if _, err = io.Copy(dst, src); err != nil { // Copy
			return err
		}
	}
	return c.HTML(http.StatusOK, fmt.Sprintf("<p>Uploaded successfully %d files</p>", len(files)))
}
func getDirectories(c echo.Context) error { // Get /directories/list/:userId
	return c.JSON(http.StatusOK, nil)
}
func postDirectories(c echo.Context) error { // Post("/directories
	username := c.Param("username")
	dir := c.Param("dir")
	createDataDir(username, dir)
	return c.JSON(http.StatusOK, nil)
}
func getText(c echo.Context) error { // Get /documents/:dir/:filename
	return c.JSON(http.StatusOK, nil)
}
func postText(c echo.Context) error  { // Post /documents/:dir/:filename
	username := c.Param("username")
	dir := c.Param("dir")
	filename := c.Param("filename")
  filepath := "../web/data/"+username+"/"+dir+"/"+filename
	createFileIfMissing(username, dir, filename)
	file, err := os.Open(filepath)
		if err != nil {
				log.Fatal("Cannot open file", err)
		}
  defer file.Close()
  fmt.Fprintf(file, "Hello Readers of golangcode.com")
	return c.JSON(http.StatusOK, nil)
}
func createDataDir(username string, dir string) {
	if _, err := os.Stat("../web/data/"+username+"/"+dir); err != nil {
			if os.IsNotExist(err) {
					os.MkdirAll("../web/data/"+username+"/"+dir, 666)
			}
	}
}
func createFileIfMissing(username string, dir string, filename string) {
	filepath := "../web/data/"+username+"/"+dir+"/"+filename
	if _, err := os.Stat(filepath); err != nil {
			if os.IsNotExist(err) {
				_, err := os.Create(filepath)
					if err != nil {
							log.Fatal("Cannot create file", err)
					}
			}
	}
}
