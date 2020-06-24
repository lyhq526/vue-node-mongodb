<template>
  <div class="video-form">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules">
      <el-form-item label="Cookie" prop="Cookie">
        <el-input type="textarea" :rows="5" placeholder="请输入Cookie" v-model="ruleForm.Cookie"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="ruleForm.desc" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="server酱" prop="desc">
        <el-input v-model="ruleForm.ftqq" placeholder="请输入server酱密钥"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addVideo } from "../../api/index";
export default {
  data() {
    var validateCookie = (rule, value, callback) => {
      if (value.includes("vqq_vusession")) {
        callback();
      } else {
        callback(new Error("请输入正确Cookie"));
      }
    };
    return {
      ruleForm: {
        desc: "",
        Cookie: "",
        ftqq: ""
      },
      rules: {
        Cookie: [{ validator: validateCookie, trigger: "blur" }]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          addVideo(this.ruleForm).then(res => {
            if (res.code == 200) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.$router.push({ path: "/home" });
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.video-form {
  width: 50%;
}
</style>