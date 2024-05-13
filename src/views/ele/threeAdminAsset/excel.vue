<template>
<div class="card-line" style="display: inline-block;">
    <Button @click="startImportData" type="primary" size="small" ghost shape="circle" icon="md-add">初期元器件导入</Button>
    <Drawer title="导入数据" closable v-model="importModalVisible" width="1000">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
            <Upload action :before-upload="beforeUploadImport" accept=".xls, .xlsx">
                <Button :loading="reading" icon="ios-cloud-upload-outline" style="margin-right: 10px">上传Excel文件</Button>
                <span v-if="uploadfile.name">当前选择文件：{{ uploadfile.name }}</span>
            </Upload>
            <Button @click="clearImportData" icon="md-trash">清空数据</Button>
        </div>
        <Alert type="warning" show-icon>导入前请下载查看导入模版数据文件查看所需字段及说明，确保数据格式正确，不得修改列英文名称</Alert>
        <Table :columns="importColumns" border :height="height" :data="importTableData" ref="importTable"></Table>
        <div class="drawer-footer">
            <!-- <Button @click="downloadTemple" type="info">下载导入模板</Button> -->
            <div style="position: absolute; right: 15px; display: inline-block">
                <Button @click="importModalVisible = false">关闭</Button>
                <Button :loading="importLoading" :disabled="importTableData.length <= 0" @click="importData" style="margin-left: 8px" type="primary">
                    确认导入
                    <span v-if="importTableData.length > 0">{{ importTableData.length }} 条数据</span>
                </Button>
            </div>
        </div>
    </Drawer>
</div>
</template>

<script>
import {
    importData
} from "./api.js";
import excel from "@/libs/excel";
export default {
    name: "line-chart",
    components: {},
    props: {},
    data() {
        return {
            importModalVisible: false,
            importTableData: [],
            importColumns: [],
            reading: false,
            uploadfile: {
                name: "",
            },
            importLoading: false
        };
    },
    methods: {
        init() {},
        startImportData() {
            this.importModalVisible = true;
        },
        beforeUploadImport(file) {
            this.uploadfile = file;
            const fileExt = file.name.split(".").pop().toLocaleLowerCase();
            if (fileExt == "xlsx" || fileExt == "xls") {
                this.readFile(file);
                this.file = file;
            } else {
                this.$Notice.warning({
                    title: "文件类型错误",
                    desc: "所选文件‘ " +
                        file.name +
                        " ’不是EXCEL文件，请选择后缀为.xlsx或者.xls的EXCEL文件。",
                });
            }
            return false;
        },
        // 读取文件
        readFile(file) {
            this.reading = true;
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onerror = (e) => {
                this.reading = false;
                this.$Message.error("文件读取出错");
            };
            reader.onload = (e) => {
                const data = e.target.result;
                const {
                    header,
                    results
                } = excel.read(data, "array");
                const tableTitle = header.map((item) => {
                    return {
                        title: item,
                        key: item,
                        minWidth: 130,
                        align: "center"
                    };
                });
                this.importTableData = results;
                this.importColumns = tableTitle;
                this.reading = false;
                this.$Message.success("读取数据成功");
            };
        },
        clearImportData() {
            this.importTableData = [];
            this.importColumns = [];
            this.uploadfile = {};
        },
        importData() {
            this.importLoading = true;
            importData(this.importTableData).then((res) => {
                this.importLoading = false;
                if (res.success) {
                    this.importModalVisible = false;
                    this.$Modal.info({
                        title: "导入结果",
                        content: res.message,
                    });
                }
            });
        },
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="less" scoped>
.card-line {
    .title-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        font-weight: 600;
        color: #495057;
        margin-bottom: 24px;

        .sortby {
            font-size: 14px;
            cursor: pointer;
            font-weight: 400;
            color: #74788d;
        }
    }

    .data-content {
        display: flex;

        .item {
            display: flex;
            align-items: baseline;
            padding: 2px 20px;

            .important {
                color: #5b73e8;
                font-weight: 500;
                font-size: 24px;
                margin-right: 16px;
            }

            .data {
                color: #495057;
                font-weight: 500;
                font-size: 24px;
                margin-right: 16px;
            }

            .desc {
                color: #74788d;
                font-size: 15px;
                font-weight: 500;
            }
        }
    }
}
</style>
