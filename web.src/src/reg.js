import {
  Tabs,
  Button,
  Input,
  Form,
  Radio,
  Empty,
  Switch,
  Card,
  Modal,
} from "ant-design-vue";

let install = function (app, options) {
  app.use(Tabs);
  app.use(Button);
  app.use(Input);
  app.use(Form);
  app.use(Radio);
  app.use(Empty);
  app.use(Card);
  app.use(Switch);
  app.use(Modal);
};
export default install;
