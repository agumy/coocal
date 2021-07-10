import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal, Button, Spin, Input } from "antd";
import { useMutation, useQuery } from "react-query";
import SharedRepository from "../../repository/SharedRepository";

export const SharedConfigModal = (
  props: React.ComponentProps<typeof Modal>
) => {
  const {
    refetch,
    isFetching: isLoading,
    data,
  } = useQuery("shared-user", SharedRepository.getUser, { enabled: false });

  useEffect(() => {
    if (props.visible && !data) {
      refetch();
    }
  }, [props.visible]);

  const [mode, setMode] = useState<"INITIAL" | "DISPLAY" | "REGISTER">(
    "INITIAL"
  );

  const inputRef = useRef<Input | null>(null);

  const onCancel = useCallback(
    (e) => {
      setMode("INITIAL");

      if (props.onCancel) {
        props.onCancel(e);
      }
    },
    [props.onCancel]
  );

  const [code, setCode] = useState("");

  const registerMutation = useMutation((code: string) =>
    SharedRepository.register(code)
  );

  const codeQuery = useQuery("shared-code", SharedRepository.generateCode, {
    enabled: false,
  });

  return (
    <Modal
      {...props}
      title="共有設定"
      footer={[
        mode !== "INITIAL" && (
          <Button
            onClick={() => {
              setMode("INITIAL");
            }}
          >
            戻る
          </Button>
        ),
        <Button key="footer.close" onClick={onCancel}>
          閉じる
        </Button>,
      ]}
      centered
      maskClosable={false}
      onCancel={onCancel}
    >
      <div className="w-full h-full flex justify-center gap-4">
        {isLoading ? (
          <Spin />
        ) : data?.user ? (
          <div>{data.user.name}さんと献立を共有しています</div>
        ) : (
          <>
            {(() => {
              switch (mode) {
                case "INITIAL": {
                  return (
                    <>
                      {" "}
                      <Button
                        onClick={() => {
                          setMode("DISPLAY");
                          if (!codeQuery.data) {
                            codeQuery.refetch();
                          }
                        }}
                      >
                        共有コードを表示する
                      </Button>
                      <Button
                        onClick={() => {
                          setMode("REGISTER");
                        }}
                      >
                        共有コードを使用する
                      </Button>
                    </>
                  );
                }
                case "DISPLAY": {
                  return (
                    <div className="flex gap-2 w-full justify-center">
                      {!codeQuery.isFetching ? (
                        <>
                          <Input
                            ref={(ref) => {
                              inputRef.current = ref;
                            }}
                            className="w-full"
                            readOnly
                            onClick={(e) => {
                              e.currentTarget.select();
                            }}
                            value={codeQuery.data?.code}
                          />
                          <Button
                            type="primary"
                            onClick={() => {
                              inputRef.current?.select();
                              document.execCommand("COPY");
                            }}
                          >
                            コピー
                          </Button>
                        </>
                      ) : (
                        <Spin />
                      )}
                    </div>
                  );
                }

                case "REGISTER": {
                  return (
                    <div className="flex gap-2 w-full">
                      <Input
                        className="w-full"
                        onChange={(e) => setCode(e.currentTarget.value)}
                      />
                      <Button
                        type="primary"
                        onClick={() => {
                          registerMutation.mutate(code);
                        }}
                        loading={registerMutation.isLoading}
                      >
                        登録
                      </Button>
                    </div>
                  );
                }
              }
            })()}
          </>
        )}
      </div>
    </Modal>
  );
};
