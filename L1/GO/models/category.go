package models

import "gopkg.in/mgo.v2/bson"

/*
Category :分类
*/
type Category struct {
	ID       bson.ObjectId `bson:"_id" json:"id"`
	Title    string        `bson:"title" json:"title"`
	IsActive int8          `bson:"is_active" json:"is_active"`
}
