import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { useStore } from "../../app/stores/store";

export default observer(function LoginForm() {
  const { userStore } = useStore();

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "", error: null }}
        onSubmit={(values, { setErrors }) =>
          userStore
            .login(values)
            .catch(() => setErrors({ error: "Невалиден email или парола" }))
        }
      >
        {({ handleSubmit, isSubmitting, errors }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <Header
              as="h2"
              content="Вход в Склад"
              color="teal"
              textAlign="center"
            />
            <MyTextInput placeholder="Email" name="email" />
            <MyTextInput placeholder="Password" name="password" type="password" />
            <ErrorMessage
              name="error"
              render={() => (
                <Label
                  style={{ marginBottom: 10 }}
                  basic
                  color="red"
                  content={errors.error}
                />
              )}
            />
            <Button
              loading={isSubmitting}
              positive
              content="Влез"
              type="submit"
              fluid
            />
          </Form>
        )}
      </Formik>
      <footer className="footer">
        <div className="footer-body">
          <div className="footer-image">
            <img src="/assets/pvu_image.png" alt="logo" height={40} />
            <img src="/assets/fes_image.png" alt="logo" height={40} />
          </div>
          <div className="footer-text">
            <p>Решения в областта на информационните и комуникационни технологии и киберсигурността в малките и средните предприятия</p>
          </div>
        </div>
      </footer>
    </>
  );
});
