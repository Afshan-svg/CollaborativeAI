import React, { useState } from "react";
//-----------libraries--------------//
import {
  Button,
  Space,
  Table,
  Tag,
  Modal,
} from "antd";
import "./Assistant.css";
//--------------helper ------------//
import { showDeleteConfirm } from "../../Utility/assistant-helper"

import {
  AiOutlineDelete,
  AiOutlineInfo,
  AiOutlineArrowUp,
} from "react-icons/ai";

//-------api----------//
import { fetchAssistantsCreatedByUser } from "../../api/assistant"
import DebouncedSearchInput from "../../Pages/SuperAdmin/Organizations/DebouncedSearchInput";
import { BsRobot } from "react-icons/bs";
//-----Helper----------//
import {  redirectToAssistant} from "../../Utility/assistant-helper"

const UserAssistantList = ({ data }) => {
  const {
    userAssistants,
    loader,
    handleDeleteAssistant,
  } = data;
  const [expandedData, setExpandedData] = useState([]);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [prefilledData, setPrefilledData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  //---------local functions -----------//
  const showInfoModal = (record) => {
    setPrefilledData(record);
    setIsInfoModalVisible(true);
  };

  const redirectToAssistant = (record) => {

    const assistantId = record.assistant_id;
    const url = `/assistants/${assistantId}`;
    window.open(url, "_blank");
  };

  const handleInfoModalCancel = () => {
    setIsInfoModalVisible(false);
  };

  //---On expand Api Call---------??
  const onExpand = async (expanded, record) => {
    if (expanded && !expandedData[record._id]) {
      try {
        const response = await fetchAssistantsCreatedByUser(1, record._id);
        if (response) {
          const assistantsCreatedByUser = response?.data || [];

          setExpandedData(
            assistantsCreatedByUser.map((assistant, index) => ({
              key: index.toString(),
              name: assistant?.name,
              instruction: assistant?.instructions,
              is_active: assistant?.is_active,
              assistant_id: assistant?.assistant_id,
              description: assistant?.description,
            }))
          );
        };
      } catch (error) {
        console.error("Error fetching assistants created by user:", error);
      }
    }
  };

  const expandedRowRender = () => {
    const columns = [
      {
        title: "Assistant",
        dataIndex: "name",
        key: "name",
        align: "center",
        render: (_, { name, image_url }) => (
          <Space size="middle" className="d-flex align-items-center">
            <div className="assistantImageDiv">
              {image_url ? (
                <img src={image_url} className="customImage" alt="avatar" />
              ) : (
                <BsRobot className="customImage" />
              )}
            </div>
            <div className="ms-2 text-start">{name}</div>
          </Space>
        ),
      },
      {
        title: "Instruction",
        dataIndex: "instruction",
        key: "instruction",
        align: "center",
      },
      {
        title: "Status",
        key: "is_active",
        align: "center",
        dataIndex: "is_active",
        width: 100,
        render: (_, { is_active = false }) => (
          <Tag color={is_active ? "green" : "red"}>
            {is_active ? "active" : "inactive"}
          </Tag>
        ),
      },

      {
        title: "Action",
        key: "action",
        align: "center",
        render: (_, record) => (
          <Space size="middle">
            <Button
              onClick={() => redirectToAssistant(record)}
              icon={<AiOutlineArrowUp />}
            ></Button>
            <Button
              onClick={() => showInfoModal(record)}
              icon={<AiOutlineInfo />}
              disabled={
                loader.ASSISTANT_LOADING
              }
            ></Button>
            <Button
              onClick={() => showDeleteConfirm(record?.assistant_id, record?.name, handleDeleteAssistant)}
              danger
              icon={<AiOutlineDelete />}
              loading={
                loader.ASSISTANT_DELETING === record.assistant_id
              }
            />
          </Space>
        ),
      },
    ];


    return (
      <Table columns={columns} dataSource={expandedData} pagination={false} />
    );
  };

  const columns = [
    {
      title: "Person Name",
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (text) => <span className="text-left">{text}</span>,
    },
    {
      title: "Total Assistants",
      dataIndex: "totalAssistants",
      key: "totalAssistants",
      align: "center",
    },
  ];

 

  // Filter assistant based on search term
  const filteredUser = userAssistants?.filter((assistant) => {
    return assistant.username.toLowerCase().includes(searchQuery.toLowerCase())
  }
  );

  return (
    <>
      <div className="mb-3">
        <DebouncedSearchInput
          data={{
            search: searchQuery,
            setSearch: setSearchQuery,
            placeholder: "Search users",
          }}
        />
      </div>
      <Table
        loading={loader.ASSISTANT_STATS_LOADING}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
          onExpand: (record, event) => {
            onExpand(record, event);
          },
        }}
        bordered={true}
        columns={columns}
        dataSource={filteredUser}
        scroll={{ y: "50vh" }}
      />
      <Modal
        title="Assistant Information"
        open={isInfoModalVisible}
        onCancel={handleInfoModalCancel}
        footer={null}
      >
        <p>
          <b>Name:</b> {prefilledData?.name}
        </p>
        <p>
          <b>Instruction:</b> {prefilledData?.instruction}
        </p>
        <p>
          <b>Description:</b> {prefilledData?.description}
        </p>
      </Modal>
    </>
  );
};

export default UserAssistantList;
