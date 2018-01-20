package controllers

import (
	"DemoFullStack/Server/db"
	"DemoFullStack/Server/lib"
	"DemoFullStack/Server/models"

	"gopkg.in/mgo.v2/bson"

	"github.com/gin-gonic/gin"
)

/*
GetCategoryList :分类列表
*/
func GetCategoryList(c *gin.Context) {
	session, db := db.Get()
	defer session.Close()

	status := lib.StatusSuccess
	collection := db.C("category")

	condition := bson.M{"is_active": 1}
	result := []models.Category{}
	err := collection.Find(condition).All(&result)
	status = lib.HandleError(err)

	// for i, category := range result {
	// 	lib.Log.Debug(i, category)
	// }

	c.SecureJSON(200, gin.H{
		"code":    status,
		"message": lib.GetStatusMessage(status),
		"data":    result,
	})
}

/*
CategoryAdd :分类添加
*/
func CategoryAdd(c *gin.Context) {
	session, db := db.Get()
	defer session.Close()

	status := lib.StatusSuccess
	collection := db.C("category")

	json := models.Category{}
	// model := models.Category{}

	err := c.ShouldBindJSON(&json)
	status = lib.HandleError(err)

	if status == lib.StatusSuccess {
		// lib.Log.Notice(json)
		json.ID = bson.NewObjectId()
		json.IsActive = 1

		err = collection.Insert(&json)
		status = lib.HandleError(err)
	}

	c.SecureJSON(200, gin.H{
		"code":    status,
		"message": lib.GetStatusMessage(status),
		"data":    json,
	})
}

/*
CategoryEdit :分类编辑
*/
func CategoryEdit(c *gin.Context) {
	session, db := db.Get()
	defer session.Close()

	status := lib.StatusSuccess
	collection := db.C("category")

	json := models.Category{}
	model := models.Category{}

	err := c.ShouldBindJSON(&json)
	status = lib.HandleError(err)

	if status == lib.StatusSuccess {
		condition := bson.M{"is_active": 1, "_id": json.ID}
		err = collection.Find(condition).One(&model)
		status = lib.HandleError(err)

		if status == lib.StatusSuccess {
			err = collection.Update(condition, json)
			status = lib.HandleError(err)
		}
	}

	c.SecureJSON(200, gin.H{
		"code":    status,
		"message": lib.GetStatusMessage(status),
		"data":    json,
	})
}

/*
CategoryRemove :分类删除
*/
func CategoryRemove(c *gin.Context) {
	session, db := db.Get()
	defer session.Close()

	status := lib.StatusSuccess
	collection := db.C("category")

	json := models.Category{}
	model := models.Category{}

	err := c.ShouldBindJSON(&json)
	status = lib.HandleError(err)

	if status == lib.StatusSuccess {
		// lib.Log.Notice(json)
		condition := bson.M{"is_active": 1, "_id": json.ID}
		err = collection.Find(condition).One(&model)
		status = lib.HandleError(err)

		if status == lib.StatusSuccess {
			model.IsActive = 0
			err = collection.Update(condition, model)
			status = lib.HandleError(err)
		}
	}

	result := map[string]interface{}{
		"id": model.ID,
	}

	c.SecureJSON(200, gin.H{
		"code":    status,
		"message": lib.GetStatusMessage(status),
		"data":    result,
	})
}

func init() {
	lib.Log.Debug("Controllers Category Init")
}
