import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import Link from "next/link";
import { auth } from "../firebase";
import { useUserContext } from "../context/UserContext";
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";
import SharedRepository from "../repository/SharedRepository";

export const Header = () => {
  const { user } = useUserContext();

  const logout = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  const [show, toggle] = useReducer((prev) => !prev, false);

  const [mode, setMode] = useState<"NONE" | "REGISTER" | "GENERATE">("NONE");
  const [code, setCode] = useState("");
  const generateCode = useCallback(async () => {
    const { code } = await SharedRepository.generateCode();
    setCode(code);
  }, []);
  useEffect(() => {
    if (user) {
      (async () => {
        const { code } = await SharedRepository.getCode();
        setCode(code);
      })();
    }
  }, [user]);

  const registerCode = useCallback(async () => {
    await SharedRepository.register(code);
  }, [code]);

  return (
    <>
      <header className="h-32 w-full bg-blue-200 flex items-center justify-between px-4">
        <div>
          <Link href="/">
            <h1
              tabIndex={0}
              role="link"
              className="text-gray-500 cursor-pointer"
            >
              Coocal
            </h1>
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2">
          {user ? (
            <>
              <span>{user.email} でログイン中</span>
              {user.emailVerified && (
                <button
                  onClick={toggle}
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500"
                >
                  共有設定
                </button>
              )}
              <button
                onClick={logout}
                className="border border-gray-500 rounded py-1 px-2 text-gray-500"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-up">
                <span
                  tabIndex={0}
                  role="link"
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500 cursor-pointer"
                >
                  登録
                </span>
              </Link>
              <Link href="/sign-in">
                <span
                  tabIndex={0}
                  role="link"
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500 cursor-pointer"
                >
                  ログイン
                </span>
              </Link>
            </>
          )}
        </div>
      </header>
      <Modal show={show} onHide={toggle} backdrop="static" centered>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title>共有設定</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="flex flex-col gap-2">
              {mode === "REGISTER" && (
                <>
                  <Form.Label>招待コード</Form.Label>
                  <Form.Control
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.currentTarget.value);
                    }}
                  />
                </>
              )}
              {mode === "NONE" && (
                <div className="w-full flex justify-center">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setMode("REGISTER")}
                  >
                    共有コードを使用する
                  </Button>
                </div>
              )}
              {mode === "GENERATE" && code && (
                <>
                  <Form.Label>招待コード</Form.Label>
                  <Form.Control
                    type="text"
                    value={code}
                    readOnly
                    onFocus={(e: SyntheticEvent<HTMLInputElement>) => {
                      e.currentTarget.select();
                    }}
                  />
                </>
              )}
              {mode === "NONE" && (
                <div className="w-full flex justify-center">
                  <Button type="button" variant="dark" onClick={generateCode}>
                    共有コードを生成する
                  </Button>
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={toggle}>
              閉じる
            </Button>
            {mode === "REGISTER" && (
              <Button type="button" variant="primary" onClick={registerCode}>
                登録
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
