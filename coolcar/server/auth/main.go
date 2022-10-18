package main

import (
	"context"
	authpb "coolcar/auth/api/gen/v1"
	auth "coolcar/auth/auth"
	"coolcar/auth/dao"
	"coolcar/auth/wechat"
	"log"
	"net"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func NewZapLogger() (*zap.Logger, error) {
	cfg := zap.NewDevelopmentConfig()
	cfg.EncoderConfig.TimeKey = ""
	return cfg.Build()
}

func main() {
	logger, err := NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create zap logger: %v", err)
	}

	lis, err := net.Listen("tcp", ":8081")
	if err != nil {
		log.Fatalf("cannot listen", zap.Error(err))
	}

	c := context.Background()
	mongoClient, err := mongo.Connect(c, options.Client().ApplyURI("mongodb://admin:19970322lgq@101.34.25.41:27017"))
	if err != nil {
		logger.Fatal("cannot connect mongo", zap.Error(err))
	}
	s := grpc.NewServer()

	authpb.RegisterAuthServiceServer(s, &auth.Service{
		OpenIdResolver: &wechat.Service{
			AppID:     "wx150687b209b0807d",
			AppSecret: "5f43b2dcab9efd37bf69e0d8e4cbbb18",
		},
		Mongo:  dao.NewMongo(mongoClient.Database("coolcar")),
		Logger: logger,
	})

	err = s.Serve(lis)
	if err != nil {
		logger.Fatal("cannot start serve", zap.Error(err))
	}
}
