package dao

import (
	"context"
	"coolcar/shared/id"
	mgutil "coolcar/shared/mongo"
	"coolcar/shared/mongo/objid"
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Mongo struct {
	col *mongo.Collection
}

func NewMongo(db *mongo.Database) *Mongo {
	return &Mongo{
		col: db.Collection("account"),
	}
}

func (m *Mongo) ResolveAccountID(c context.Context, openID string) (id.AccountID, error) {
	res := m.col.FindOneAndUpdate(c, bson.M{
		"open_id": openID,
	}, bson.M{
		"$set": bson.M{
			"open_id": openID,
		},
	}, options.FindOneAndUpdate().
		SetUpsert(true).
		SetReturnDocument(options.After))

	if err := res.Err(); err != nil {
		return "", fmt.Errorf("cannot findOneAndUpdate: %v", err)
	}

	var row mgutil.IDField
	err := res.Decode(&row)
	if err != nil {
		return "", fmt.Errorf("cannot decode result: %v", err)
	}

	return objid.ToAccountID(row.ID), nil
}
