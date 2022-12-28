import { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Spin, Button, Upload, message, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import * as actions from "../../actions/index";
import TagList from "../../components/TagList";
import "./index.scss";

const List = ({ loading, uploadIcons, checkIcons, getTags, history }) => {
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);

  const handleRemove = (rmFile) => {
    setFileList((pre) => pre.filter((file) => file !== rmFile));
  };

  const beforeUpload = (file) => {
    file.url = URL.createObjectURL(file);
    setFileList((pre) => [...pre, file]);
    return false;
  };

  const handleUpload = async (removeColor, confirmed) => {
    if (fileList.some((file) => !/^[\u4e00-\u9fa5a-zA-Z]/.test(file.name))) {
      message.error("文件名不能以特殊字符开头");
      return;
    }
    if (fileList.some((file) => file.size > 10 * 1024)) {
      message.error("文件大小不能超过10kb");
      return;
    }

    const formData = new FormData();
    formData.append("theme", removeColor ? "fill" : "native");
    if (tags.length > 0) {
      formData.append("tags", tags.join(","));
    }
    fileList.forEach((file) => {
      const fieldName = file.name.split(".")[0];
      formData.append(fieldName, file);
    });
    if (!confirmed) {
      try {
        await checkIcons({
          theme: removeColor ? "fill" : "native",
          list: fileList.map((file) => file.name.split(".")[0]),
        });
      } catch (error) {
        if (error.code === 1002) {
          Modal.confirm({
            title: "确定覆盖已有文件?",
            content: error.message,
            onOk: () => handleUpload(removeColor, true),
          });
        } else {
          message.error(error.message);
        }
        return;
      }
    }
    await uploadIcons(formData);
    getTags();
    history.replace("/list");
  };

  return (
    <Spin spinning={loading}>
      <main className="upload-page">
        <Upload
          listType="picture-card"
          accept="image/svg+xml"
          multiple={true}
          showUploadList={{ showPreviewIcon: false }}
          beforeUpload={beforeUpload}
          onRemove={handleRemove}
          fileList={fileList}
        >
          <div className="upload-page__add">
            <PlusCircleOutlined />
            <div>上传</div>
          </div>
        </Upload>
        <div className="upload-page__tip">
          <p>仅支持svg格式,大小不超过10kb</p>
          <p>
            支持批量上传，上传图标自动转换中文为拼音(文件名不能包含除了中划线-和下划线_外的特殊字符)
          </p>
          <p>上传图标不可删除更改，有图标更改请重命名上传</p>
        </div>
        <TagList
          className="upload-page__tags"
          editable={true}
          value={tags}
          onChange={setTags}
        />
        <div className="upload-page__btns">
          <Link to="/list" replace={true}>
            <Button>取消</Button>
          </Link>
          <Button
            type="primary"
            onClick={() => handleUpload(true)}
            disabled={fileList.length <= 0}
          >
            去除颜色并提交
          </Button>
          <Button
            type="danger"
            onClick={() => handleUpload(false)}
            disabled={fileList.length <= 0}
          >
            保留颜色并提交
          </Button>
        </div>
      </main>
    </Spin>
  );
};

export default connect(({ common }) => ({ loading: common.loading }), {
  ...actions,
})(List);
