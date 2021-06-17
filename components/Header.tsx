import { useCallback, useReducer, useState } from "react";
import Link from "next/link";
import { auth, firestore } from "../firebase";
import { useUserContext } from "../context/UserContext";
import Modal from "react-bootstrap/Modal";
import { Button, Form } from "react-bootstrap";

export const Header = () => {
  const { user, scope } = useUserContext();

  const logout = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  const [show, toggle] = useReducer((prev) => !prev, false);

  const [token, setToken] = useState("");

  const generateToken = async () => {
    if (user) {
      if (!scope) {
        const doc = await firestore
          .collection("scope")
          .add({ users: [user.uid] });

        setToken(doc.id);
        toggle();
        return;
      }

      setToken(scope);
      toggle();
    }
  };

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
                  onClick={generateToken}
                  className="border border-gray-500 rounded py-1 px-2 text-gray-500"
                >
                  パートナーを招待
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
            <Modal.Title>パートナーを招待する</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>招待URL</Form.Label>
              <Form.Control
                type="text"
                value={`http://localhost:3000/sign-up?code=${token}`}
                readOnly
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={toggle}>
              閉じる
            </Button>
            {/* <Button type="submit" variant="primary">
              招待
            </Button> */}
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
