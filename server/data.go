package convolvr

import (
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/labstack/echo"
)

type Document struct {
	Name     string `json:"name"`
	Text     string `json:"text"`
	UserName string `json:"username"`
}

/* /files/list/:username/:dir */
func listFiles(c echo.Context) error {
	username := c.Param("username")
	dir := c.QueryParam("dir")
	filepath := "../web/user/" + username + "/"
	if dir != "" {
		filepath = filepath + dir
	}
	files, _ := ioutil.ReadDir(filepath)
	fileNames := []string{}
	for _, f := range files {
		if f.IsDir() == false {
			fileNames = append(fileNames, f.Name())
		} // test
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
	dir := c.QueryParam("dir")
	var thumbnails []string
	log.Printf(`post files "%s" "%s"`, username, dir)
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close() // Destination
	filepath := "../web/user/"
	if dir != "" {
		createDataDir(username, dir)
		filepath = filepath + username + "/" + dir
	} else {
		filepath = filepath + username
	}
	fileName := strings.Replace(file.Filename, " ", "-", -1)
	dst, err := os.Create(filepath + "/" + fileName)
	if err != nil {
		return err
	}
	defer dst.Close()
	if _, err = io.Copy(dst, src); err != nil { // Copy
		return err
	}
	isImage, _ := regexp.MatchString("(.png|.jpg|.jpeg|.webp|.gif)", fileName)
	if isImage {
		thumbnails = append(thumbnails, fileName)
		makeThumbnails(filepath, thumbnails)
	}
	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s uploaded successfully</p>", fileName))
}

/* /files/upload-multiple/:username/:dir */
func postMultipleFiles(c echo.Context) error {
	form, err := c.MultipartForm()
	username := c.Param("username")
	dir := c.QueryParam("dir")
	if err != nil {
		return err
	}
	filepath := "../web/user/"
	if dir != "" {
		createDataDir(username, dir)
		filepath = filepath + username + "/" + dir
	} else {
		filepath = filepath + username
	}
	files := form.File["files"]
	var thumbnails []string
	for _, file := range files {
		src, err := file.Open() // Source
		if err != nil {
			return err
		}
		fileName := strings.Replace(file.Filename, " ", "-", -1)
		defer src.Close()
		isImage, _ := regexp.MatchString("(.png|.jpg|.jpeg|.webp|.gif)", fileName)
		if isImage {
			thumbnails = append(thumbnails, fileName)
		}
		dst, err := os.Create(filepath + "/" + fileName) // Destination
		if err != nil {
			return err
		}
		defer dst.Close()
		if _, err = io.Copy(dst, src); err != nil { // Copy
			return err
		}
	}
	if len(thumbnails) > 0 {
		makeThumbnails(filepath, thumbnails)
	}
	return c.HTML(http.StatusOK, fmt.Sprintf("<p>Uploaded successfully %d files</p>", len(files)))
}

func makeThumbnails(filepath string, thumbnails []string) {
	for _, thumb := range thumbnails {
		img, err := imaging.Open(filepath + "/" + thumb)
		if err != nil {
			panic(err)
		}
		thumbImage := imaging.Thumbnail(img, 256, 256, imaging.Box)
		saveThumbErr := imaging.Save(thumbImage, filepath+"/thumbs/"+thumb+".jpg")
		if saveThumbErr != nil {
			panic(saveThumbErr)
		}
		thumbImage = imaging.Thumbnail(img, 512, 512, imaging.Box)
		saveThumbErr = imaging.Save(thumbImage, filepath+"/thumbs/"+thumb+".512.jpg")
		if saveThumbErr != nil {
			panic(saveThumbErr)
		}
	}
}

/* /directories/list/:username/:dir */
func getDirectories(c echo.Context) error {
	username := c.Param("username")
	dir := c.QueryParam("dir")
	filepath := "../web/user/"
	if dir != "" {
		filepath = filepath + username + "/" + dir
	} else {
		filepath = filepath + username
	}
	files, _ := ioutil.ReadDir(filepath)
	fileNames := []string{}
	for _, f := range files {
		if f.IsDir() {
			fileNames = append(fileNames, f.Name())
		}
	}
	return c.JSON(http.StatusOK, fileNames)
}

/* /directories/:username */
func postDirectories(c echo.Context) error {
	username := c.Param("username")
	dir := c.QueryParam("dir")
	createDataDir(username, dir)
	return c.JSON(http.StatusOK, nil)
}

/* /documents/:username/:dir/:filename */
func getText(c echo.Context) error {
	username := c.Param("username")
	dir := c.QueryParam("dir")
	filename := c.Param("filename")
	filepath := "../web/user/" + username + "/" + dir + "/" + filename
	file, err := ioutil.ReadFile(filepath)
	if err != nil {
		log.Fatal("Cannot open file", err)
	}
	return c.JSON(http.StatusOK, map[string]string{"text": string(file)})
}

/* /documents/:username/:dir/:filename */
func postText(c echo.Context) error {
	username := c.Param("username")
	filename := c.Param("filename")
	dir := c.QueryParam("dir")

	d := new(Document)
	if err := c.Bind(d); err != nil {
		return c.JSON(http.StatusOK, nil)
	}

	filepath := "../web/user/" + username + "/" + dir + "/" + filename
	createFileIfMissing(username, dir, filename)

	writeErr := ioutil.WriteFile(filepath, []byte(d.Text), 0644)
	if writeErr != nil {
		panic(writeErr)
	}

	return c.JSON(http.StatusOK, nil)
}

func createDataDir(username string, dir string) {

	if _, err := os.Stat("../web/user/" + username + "/" + dir); err != nil {

		if os.IsNotExist(err) {
			os.MkdirAll("../web/user/"+username+"/"+dir+"/thumbs", 0777)
		}
	}

}

func createFileIfMissing(username string, dir string, filename string) {
	filepath := "../web/user/" + username + "/" + dir + "/" + filename
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
