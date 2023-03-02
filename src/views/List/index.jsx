import { useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Input, Button, Radio, Checkbox, Popconfirm } from "antd";
import throttle from "lodash/throttle";

import * as actions from "../../actions/index";
import CopyableIcon from "../../components/CopyableIcon";
import TagSelect from "../../components/TagSelect";
import TagSelectModal from "./TagSelectModal";
import "./index.scss";

const List = ({
  loading,
  componentMap,
  getIconList,
  exportSvg,
  deleteIcons,
}) => {
  const [list, setList] = useState([]);
  const [nativeList, setNativeList] = useState([]);
  const [theme, setTheme] = useState("fill");
  const [keyword, setKeyword] = useState("");
  const [tags, setTags] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tagSelectModalVisible, setTagSelectModalVisible] = useState(false);

  const iconList = theme === "native" ? nativeList : list;

  const loadData = useCallback(async () => {
    const res = await getIconList({ theme, tags: tags.join(",") });
    const newList = res.filter(
      ({ name, label }) =>
        name.toLowerCase().includes(keyword.toLowerCase()) ||
        label.toLowerCase().includes(keyword.toLowerCase())
    );
    theme === "native" ? setNativeList(newList) : setList(newList);
  }, [getIconList, theme, tags, keyword]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hanleThemeChange = (e) => {
    setTheme(e.target.value);
    setSelectedItems([]);
  };

  const handleSelect = (name, selected) => {
    if (selected) {
      setSelectedItems([...selectedItems, name]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== name));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const selectedItems = iconList.map(({ name }) => name);
      setSelectedItems(selectedItems);
    } else {
      setSelectedItems([]);
    }
  };

  const handleDownload = () => {
    const icons = selectedItems.map((item) => {
      const info = iconList.find(({ name }) => name === item);
      return {
        name: info.label,
        data: componentMap[`${item}${theme}`],
      };
    });
    console.log("==icons==", icons);
    // exportSvg(icons);
  };

  const handleDelete = async () => {
    await deleteIcons({ types: selectedItems, theme });
    await loadData();
  };

  return (
    <main className="list-page">
      <div className="list-page__top">
        <Radio.Group
          className="list-page__theme"
          buttonStyle="solid"
          value={theme}
          onChange={hanleThemeChange}
        >
          <Radio.Button value="fill">单色图标</Radio.Button>
          <Radio.Button value="native">原色图标</Radio.Button>
        </Radio.Group>
        <Button
          className="list-page__batch"
          onClick={() => setBatchMode(!batchMode)}
        >
          {batchMode ? "取消批量操作" : "批量操作"}
        </Button>
        <Link to="/upload">
          <Button type="primary">上传图标</Button>
        </Link>
      </div>
      <div className="list-page__top">
        <Input.Search
          className="list-page__search"
          placeholder="在此搜索图标, 点击图标可复制代码"
          value={keyword}
          onChange={throttle((e) => setKeyword(e.target.value), 300)}
        />
        <TagSelect
          className="list-page__tag-select"
          placeholder="选择分类"
          value={tags}
          onChange={(tags) => setTags(tags)}
        />
      </div>
      {batchMode && (
        <div className="list-page__top">
          <Button
            type="link"
            disabled={selectedItems.length === 0}
            onClick={() => setTagSelectModalVisible(true)}
          >
            批量添加分类
          </Button>
          {/* <Button
            type="link"
            disabled={selectedItems.length === 0 || loading}
            onClick={handleDownload}
          >
            批量下载
          </Button> */}
          <Popconfirm
            title={`确定删除选中的 ${selectedItems.length} 项图标?`}
            onConfirm={handleDelete}
          >
            <Button
              type="link"
              disabled={selectedItems.length === 0 || loading}
            >
              批量删除
            </Button>
          </Popconfirm>
          <Checkbox
            checked={iconList.length === selectedItems.length}
            onChange={handleSelectAll}
          >
            全选
          </Checkbox>
        </div>
      )}
      <ul className="list-page__content">
        {iconList.map(({ name, label }) => (
          <CopyableIcon
            key={name}
            label={label}
            type={name}
            theme={theme}
            batchMode={batchMode}
            selected={selectedItems.includes(name)}
            onSelect={handleSelect}
          />
        ))}
      </ul>
      {tagSelectModalVisible && (
        <TagSelectModal
          visible={tagSelectModalVisible}
          close={() => setTagSelectModalVisible(false)}
          selectedItems={selectedItems}
        />
      )}
    </main>
  );
};

export default connect(
  ({ common, componentMap }) => ({ loading: common.loading, componentMap }),
  { ...actions }
)(List);
