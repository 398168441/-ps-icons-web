import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Input, InputNumber, Tabs, Popover } from "antd";
import { SketchPicker } from "react-color";
import throttle from "lodash/throttle";

import * as actions from "../../actions/index";
import DragableIcon from "../../components/DragableIcon";
import TagSelect from "../../components/TagSelect";
import "./index.scss";

const getColorPicker = (color, setColor) => {
  // presetColors
  return (
    <SketchPicker color={color} onChange={(color) => setColor(color.rgb)} />
  );
};
const List = ({ getIconList }) => {
  const [list, setList] = useState([]);
  const [nativeList, setNativeList] = useState([]);
  const [theme, setTheme] = useState("fill");
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState([]);
  const [size, setSize] = useState(16);
  const [color, setColor] = useState({ r: "51", g: "51", b: "51", a: "1" });

  useEffect(() => {
    const loadData = async () => {
      setList([]);
      const res = await getIconList({ theme, tags: tags.join(",") });
      const newList = res.filter(
        ({ name, label }) =>
          name.toLowerCase().includes(keyword.toLowerCase()) ||
          label.toLowerCase().includes(keyword.toLowerCase())
      );
      theme === "native" ? setNativeList(newList) : setList(newList);
    };
    loadData();
  }, [theme, keyword, tags, getIconList]);

  const handleGotoUpload = () => {
    console.log(`${window.location.protocol}//${window.location.host}/upload`);
    window.postMessage(
      "externalLinkClicked",
      `${window.location.protocol}//${window.location.host}/upload`
    );
  };

  const colorStr = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  return (
    <main className="list-for-plugin">
      <div className="list-for-plugin__top">
        <Tabs activeKey={theme} onChange={setTheme}>
          <Tabs.TabPane tab="单色风格" key="fill" />
          <Tabs.TabPane tab="多色风格" key="native" />
        </Tabs>
        <div className="list-for-plugin__toolbox">
          <Input.Search
            className="list-for-plugin__search"
            placeholder="搜索图标"
            value={keyword}
            onChange={throttle((e) => setKeyword(e.target.value), 300)}
          />
          <Popover
            overlayClassName="list-for-plugin__color-panel"
            placement="bottomRight"
            trigger="click"
            content={getColorPicker(color, setColor)}
          >
            <div className="list-for-plugin__color">
              <div
                className="list-for-plugin__color-block"
                style={{ background: colorStr }}
              />
            </div>
          </Popover>
          <InputNumber
            className="list-for-plugin__size"
            value={size}
            onChange={setSize}
          />
        </div>
        <TagSelect
          className="list-for-plugin__tag-select"
          placeholder="选择分类"
          value={tags}
          onChange={(tags) => setTags(tags)}
        />
      </div>
      <ul className="list-for-plugin__content">
        {(theme === "native" ? nativeList : list).map(({ name, label }) => (
          <DragableIcon
            key={name}
            label={label}
            type={name}
            theme={theme}
            size={size}
            color={colorStr}
          />
        ))}
      </ul>
      <Button
        type="link"
        className="list-for-plugin__upload"
        onClick={handleGotoUpload}
      >
        上传图标
      </Button>
    </main>
  );
};

export default connect(null, { ...actions })(List);
