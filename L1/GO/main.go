package main

import (
	"DemoFullStack/L1/GO/controllers"
	"DemoFullStack/L1/GO/lib"
	"io"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func initLog(b bool) {
	// Logging to a file.
	if b {
		// gin.DisableConsoleColor()
		f, _ := os.Create("gin.log")
		gin.DefaultWriter = io.MultiWriter(f)

		// Use the following code if you need to write the logs to file and console at the same time.
		gin.DefaultWriter = io.MultiWriter(f, os.Stdout)

		// lib.Log.Notice("Log ready")
	}
}

/*
Cors :HTTP Cross-Origin Resource Sharing Handler
*/
func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Add("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Add("Access-Control-Allow-Methods", "POST,PUT,DELETE,OPTIONS")
		c.Writer.Header().Add("Access-Control-Allow-Headers", "Content-Type,Authorization")
		if strings.ToLower(c.Request.Method) == "options" {
			// lib.Log.Notice("OPTIONS Request")
			// ctx.ResponseWriter.WriteHeader(200)
			c.Writer.WriteHeader(200)
			c.Abort()
			return
		}
		c.Next()
	}
}

func setupRouter() *gin.Engine {
	if lib.ConfigIsRelease {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.Default()
	router.Use(Cors())

	// Ping
	router.GET("/ping", func(c *gin.Context) {
		c.String(200, "pong")
	})

	// Handle Restful API: /api
	app := router.Group("/api")
	{
		app.GET("/category/list", controllers.GetCategoryList)
		app.POST("/category/add", controllers.CategoryAdd)
		app.PUT("/category/edit", controllers.CategoryEdit)
		app.DELETE("/category/remove", controllers.CategoryRemove)
	}

	return router
}

func main() {
	// Log
	initLog(false)

	router := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	router.Run(":8080")
}
