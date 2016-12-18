package convolvr_test

import (
	"log"
	"os"
	"time"

	"github.com/SpaceHexagon/convolvr"
	. "github.com/onsi/ginkgo"
	. "github.com/onsi/gomega"

	"testing"
)

const apiURL = "http://localhost:3010/api"
const configName = "config.test"
const dbName = "world.test.db"

var _ = BeforeSuite(func() {
	go convolvr.Start(configName)
	time.Sleep(1000 * time.Millisecond)
})

var _ = AfterSuite(func() {
	err := os.Remove(dbName)
	if err != nil {
		log.Fatal(err)
	}
})

func TestConvolvr(t *testing.T) {
	RegisterFailHandler(Fail)
	RunSpecs(t, "Convolvr Suite")
}
