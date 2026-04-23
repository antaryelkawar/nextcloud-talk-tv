import { Text, View } from "@lightningtv/solid";
import { useNavigate } from "@solidjs/router";
import { onMount } from "solid-js";
import { Column } from "@lightningtv/solid/primitives";
import { setGlobalBackground } from "../state";

const LoginPage = () => {
  const navigate = useNavigate();

  onMount(() => {
    setGlobalBackground("#0082C9");
  });

  const handleLogin = () => {
    console.log("Dummy login successful!");
    navigate("/browse/all");
  };

  return (
    <View width={1920} height={1080} x={0} y={0}>
      <Column x={960} y={540} alignItems="center" justifyContent="center" gap={50}>
        <Text fontSize={80} fontWeight="bold" color="white">
          Nextcloud Talk TV
        </Text>
        <Text fontSize={40} color="white">
          Welcome to the Demo
        </Text>
        <View 
          width={400} 
          height={100} 
          color="#FFFFFF" 
          onClick={handleLogin}
          style={{ borderRadius: '10px' }}
        >
          <Text color="#0082C9" fontSize={40} fontWeight="bold">
            Login
          </Text>
        </View>
      </Column>
    </View>
  );
};

export default LoginPage;
