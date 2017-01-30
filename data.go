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

/* /files/list/:username/:dir */
func listFiles(c echo.Context) error {
	username := c.Param("username")
	dir := c.Param("dir")
	filepath := "../web/data/"+username+"/"
	if (dir != "") {
		filepath = filepath+dir
	}
	files, _ := ioutil.ReadDir(filepath)
	fileNames := []string{}
  for _, f := range files {
		if f.IsDir() == false {
			fileNames = append(fileNames, f.Name())
		}
  }
	return c.JSON(http.StatusOK, fileNames)
}
/* /files/download/:username/:dir/:filename (redundant at the moment) */
func getFiles(c echo.Context) error {
	return c.JSON(http.StatusOK, nil)
}
/* /files/upload/:username/:dir */
func postFiles(c echo.Context) error {
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
	filepath := "../web/data/"
	if dir != "" {
		createDataDir(username, dir)
		filepath = filepath+username+"/"+dir
	} else {
		filepath = filepath+username
	}
	dst, err := os.Create(filepath+"/"+file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()
	if _, err = io.Copy(dst, src); err != nil { // Copy
		return err
	}
	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s uploaded successfully</p>", file.Filename))
}
/* /files/upload-multiple/:username/:dir */
func postMultipleFiles(c echo.Context) error {
	form, err := c.MultipartForm()
	username := c.Param("username")
	dir := c.Param("dir")
	if err != nil {
		return err
	}
	filepath := "../web/data/"
	if dir != "" {
		createDataDir(username, dir)
		filepath = filepath+username+"/"+dir
	} else {
		filepath = filepath+username
	}
	files := form.File["files"]
	for _, file := range files {
		src, err := file.Open() // Source
		if err != nil {
			return err
		}
		defer src.Close()
		dst, err := os.Create(filepath+"/"+file.Filename) // Destination
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
/* /directories/list/:username/:dir */
func getDirectories(c echo.Context) error {
	username := c.Param("username")
	dir := c.Param("dir")
	filepath := "../web/data/"
	if dir != "" {
		filepath = filepath+username+"/"+dir
	} else {
		filepath = filepath+username
	}
	files, _ := ioutil.ReadDir(filepath)
	fileNames := []string{}
  for _, f := range files {
		if (f.IsDir()) {
			fileNames = append(fileNames, f.Name())
		}
  }
	return c.JSON(http.StatusOK, fileNames)
}
/* /directories/:username/:dir */
func postDirectories(c echo.Context) error {
	username := c.Param("username")
	dir := c.Param("dir")
	createDataDir(username, dir)
	return c.JSON(http.StatusOK, nil)
}
/* /documents/:username/:dir/:filename */
func getText(c echo.Context) error {
	username := c.Param("username")
	dir := c.Param("dir")
	filename := c.Param("filename")
	filepath := "../web/data/"+username+"/"+dir+"/"+filename
	file, err := ioutil.ReadFile(filepath)
		if err != nil {
				log.Fatal("Cannot open file", err)
		}
	return c.JSON(http.StatusOK, map[string]string{"text": string(file)})
}
/* /documents/:username/:dir/:filename */
func postText(c echo.Context) error  {
	username := c.Param("username")
	dir := c.Param("dir")
	filename := c.Param("filename")
	text := c.FormValue("text")
  filepath := "../web/data/"+username+"/"+dir+"/"+filename
	createFileIfMissing(username, dir, filename)
	file, err := os.OpenFile(filepath, os.O_WRONLY | os.O_CREATE | os.O_TRUNC, 0777)
		if err != nil {
				log.Fatal("Cannot open file", err)
		}
  defer file.Close()
  fmt.Fprintf(file, text)
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
				createDataDir(username, dir)
				_, err := os.Create(filepath)
					if err != nil {
							log.Fatal("Cannot create file", err)
					}
			}
	}
}
