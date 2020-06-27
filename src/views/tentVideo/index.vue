<template>
  <div class="video-form">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" :rules="rules">
      <el-form-item label="登录URL" prop="loginUrl">
        <el-input type="textarea" :rows="5" placeholder="请输入url" v-model="ruleForm.loginUrl"></el-input>
      </el-form-item>
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
import { addVideo, selectData, updataVideo } from "../../api/index";
export default {
  data() {
    const validateCookie = (rule, value, callback) => {
      if (value.includes("vqq_vusession")) {
        callback();
      } else {
        callback(new Error("请输入正确Cookie"));
      }
    };
    const validateLoginUrl = (rule, value, callback) => {
      if (value.includes("access.video.qq.com/user/auth_refresh?")) {
        callback();
      } else {
        callback(new Error("请输入正确URL"));
      }
    };
    return {
      ruleForm: {
        desc: "",
        Cookie: "",
        loginUrl: "",
        ftqq: ""
      },
      rules: {
        Cookie: [{ validator: validateCookie, trigger: "blur" }],
        loginUrl: [{ validator: validateLoginUrl, trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      selectData({ id: this.$route.query.id }).then(res => {
        if (res.code == 200) {
          this.ruleForm.loginUrl = res.data.loginUrl;
          this.ruleForm.ftqq = res.data.ftqq;
          this.ruleForm.desc = res.data.desc;
          this.ruleForm.Cookie = res.data.Cookie;
        } else {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.$route.query.id) {
            addVideo(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.$router.push({ path: "/home" });
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            });
          } else {
            updataVideo({ ...this.ruleForm, id: this.$route.query.id }).then(
              res => {
                if (res.code == 200) {
                  this.$message({
                    message: res.message,
                    type: "success"
                  });
                  this.$router.push({ path: "/home" });
                } else {
                  this.$message({
                    message: res.message,
                    type: "error"
                  });
                }
              }
            );
          }
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