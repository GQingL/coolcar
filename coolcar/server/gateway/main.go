package main

import (
	"context"
	"log"
	"net/http"
	"net/textproto"

	"github.com/grpc-ecosystem/grpc-gateway/runtime"
	"github.com/namsral/flag"
	"go.uber.org/zap"
	"google.golang.org/grpc"
)

func NewZapLogger() (*zap.Logger, error) {
	cfg := zap.NewDevelopmentConfig()
	cfg.EncoderConfig.TimeKey = ""
	return cfg.Build()
}

var addr = flag.String("addr", ":8080", "address to listen")
var authAddr = flag.String("auth_addr", "localhost:8081", "address for auth service")

func main() {
	flag.Parse()

	lg, err := NewZapLogger()
	if err != nil {
		log.Fatalf("cannot create zap logger: %v", err)
	}
	c := context.Background()
	c, cancel := context.WithCancel(c)
	defer cancel()

	mux := runtime.NewServeMux(runtime.WithMarshalerOption(
		runtime.MIMEWildcard, &runtime.JSONPb{
			EnumsAsInts: true,
			OrigName:    true,
		},
	), runtime.WithIncomingHeaderMatcher(func(key string) (string, bool) {
		if key == textproto.CanonicalMIMEHeaderKey(runtime.MetadataHeaderPrefix) {
			return "", false
		}
		return runtime.DefaultHeaderMatcher(key)
	}))

	serverConfig := []struct {
		name         string
		addr         string
		registerFunc func(ctx context.Context, mux *runtime.ServeMux, endpoint string, opts []grpc.DialOption) (err error)
	}{
		{
			name: "auth",
			addr: *authAddr,
		},
	}

	for _, s := range serverConfig {
		err := s.registerFunc(
			c, mux, s.addr,
			[]grpc.DialOption{grpc.WithInsecure()},
		)
		if err != nil {
			lg.Sugar().Fatalf("cannot register service %s: %v", s.name, err)
		}
	}
	http.HandleFunc("/healthz", func(rw http.ResponseWriter, r *http.Request) {
		rw.Write([]byte("ok"))
	})
	http.Handle("/", mux)
	lg.Sugar().Infof("grpc gateway started at %s", *addr)
	lg.Sugar().Fatal(http.ListenAndServe(*addr, nil))
}
