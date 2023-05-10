import axios from 'axios';
import { defineComponent, onMounted, PropType, ref } from 'vue';
import { useRouter } from 'vue-router';
import s from './homeRight.module.scss';
import { getDateNow, getDateTime } from './Time';
import fetchJsonp from 'fetch-jsonp';
import createMessage from '../components/Message';
export const HomeRight = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const router = useRouter()
    const city = ref('')
    const cityTemp = ref({
      air: '',
      wea: '', //天气
      win: '', //风
      tem: '' //温度
    })
    const toWebPage = (url: string) => {
      window.open(url, '_blank');
    }
    const gotoDeatil = (url: string) => {
      router.push(url)
    }
    const handleSearchResults = (data: any) => {
      city.value = data.city
    };
    // 获取地理位置（高德）
    const getLocation = () => {
      const url = 'https://restapi.amap.com/v3/ip?key=7ef462c39299f921a8a2557ad84c2cb2';
      fetchJsonp(url, { jsonpCallback: 'callback' })
        .then(response => response.json())
        .then(data => handleSearchResults(data))
        .catch(error => createMessage({ type: "error", message: "获取地理位置错误" }))
    }
    const getAppId = () => '99368856'
    const getAppSecret = () => 'yJf63oaQ'
     // 获取位置对应的城市id（易客云）
    const getCityId = async (cityName: string) => {
      const url = `https://tianqiapi.com/api?version=v6&appid=${getAppId()}&appsecret=${getAppSecret()}&city=${cityName}`;
      const response = await fetchJsonp(url, {
        jsonpCallback: 'callback',
      });
      const data = await response.json();
      return data.cityid;
    };
     // 获取城市天气（易客云）
    const getWeather = async (cityName: string) => {
      try {
        const cityId = await getCityId(cityName);
        const weatherUrl = `https://tianqiapi.com/free/day?appid=${getAppId()}&appsecret=${getAppSecret()}&cityid=${cityId}`;
        const response = await fetchJsonp(weatherUrl, {
          jsonpCallback: 'callback',
        });
        const data = await response.json();
        const { win, win_speed, tem, wea } = data;
        Object.assign(cityTemp.value, {
          air: win_speed,
          wea: wea,
          win: win,
          tem: tem
        });
      } catch (error) {
        createMessage({ type: "error", message: "获取天气信息错误" })
      }
    };
    onMounted(() => {
      getLocation()
      getWeather(city.value)
    })
    const { currentTime, date, month, year } = getDateNow()
    const { dayOfWeek } = getDateTime()
    return () => (
      <section class={s.right}>
        <div class={s.info}>
          <div class={s.function}>
            <div class={[s.fn, s.cards]} onClick={() => toWebPage('http://8.130.24.249:8080/#')}>
              <span> -「 山竹记账 」</span>
              <svg class={s.svg}><use xlinkHref='#mangosteen'></use></svg>
            </div>
            <div class={[s.fn, s.cards]} onClick={() => toWebPage('https://hhstu.caokejian.club/#')}>
              <span>{year} 年 0{month} 月 {date} 日 {dayOfWeek}</span>
              <span class={s.time}>{currentTime}</span>
              <span>{city.value} {cityTemp.value.wea} {cityTemp.value.tem}°C {cityTemp.value.win} {cityTemp.value.air}</span>
            </div>
          </div>
          <div class={s.links}>
            <div class={s.line}>
              <svg class={s.svg}><use xlinkHref='#content'></use></svg>
              <span>网站列表</span>
            </div>
            <div class={s.lis}>
              <div class={s.el} onClick={() => gotoDeatil('/resume')}>
                <div class={[s.li, s.cards]}> <svg class={s.svg}><use xlinkHref='#resume'></use></svg><span>简历</span></div>
              </div>
              <div class={s.el}>
                <div class={[s.li, s.cards]}>  <svg class={s.svg}><use xlinkHref='#blog'></use></svg>博客</div>
              </div>
              <div class={s.el}>
                <div class={[s.li, s.cards]}>   <svg class={s.svg}><use xlinkHref='#item'></use></svg>项目</div>
              </div>
              <div class={s.el}>
                <div class={[s.li, s.cards]}>  <svg class={s.svg}><use xlinkHref='#github'></use></svg>Github</div>
              </div>
              <div class={s.el}>
                <div class={[s.li, s.cards]}> <svg class={s.svg}><use xlinkHref='#juejin'></use></svg>掘金</div>
              </div>
              <div class={s.el} onClick={() => gotoDeatil('/search')}>
                <div class={[s.li, s.cards]}> <svg class={s.svg}><use xlinkHref='#search'></use></svg>
                  搜索引擎</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
})