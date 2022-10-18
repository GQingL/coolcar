function genProto {
    DOMAIN=$1
    SKIP_GATEWAY=$2
    PROTO_PATH=./${DOMAIN}/api
    GO_OUT_PATH=./${DOMAIN}/api/gen/v1
    mkdir -p $GO_OUT_PATH

    protoc -I=$PROTO_PATH --go_out=$GO_OUT_PATH --go_opt=paths=source_relative --go-grpc_out=require_unimplemented_servers=false:$GO_OUT_PATH --go-grpc_opt=paths=source_relative  $PROTO_PATH/${DOMAIN}.proto

    if [ $SKIP_GATEWAY ]; then
        return
    fi

    protoc -I=$PROTO_PATH --grpc-gateway_out=paths=source_relative,grpc_api_configuration=$PROTO_PATH/${DOMAIN}.yaml:$GO_OUT_PATH ${DOMAIN}.proto

    PBTS_BIN_DIR=../wx/miniprogram/node_modules/.bin
    PBTS_OUT_DIR=../wx/miniprogram/service/proto_gen/${DOMAIN}
    mkdir -p $PBTS_OUT_DIR
    $PBTS_BIN_DIR/pbjs -t static -w es6 $PROTO_PATH/${DOMAIN}.proto --no-create --no-encode --no-decode --no-verify --no-delimited --force-number -o $PBTS_OUT_DIR/${DOMAIN}_pb_tmp.js
    echo 'import * as $protobuf from "protobufjs";' > $PBTS_OUT_DIR/${DOMAIN}_pb.js
    cat $PBTS_OUT_DIR/${DOMAIN}_pb_tmp.js >> $PBTS_OUT_DIR/${DOMAIN}_pb.js
    rm $PBTS_OUT_DIR/${DOMAIN}_pb_tmp.js
    $PBTS_BIN_DIR/pbts -o $PBTS_OUT_DIR/${DOMAIN}_pb.d.ts $PBTS_OUT_DIR/${DOMAIN}_pb.js
}

genProto auth
genProto rental
genProto blob 1
genProto car