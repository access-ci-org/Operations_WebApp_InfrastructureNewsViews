<template>
  <div class="infrastructure-news-container w-100 p-2">

    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link" :class="{'active': activeTab === 'current'}" v-on:click="activeTab='current'"
           href="#">Current <span class="badge bg-light text-dark"
                                  v-if="currentOutages">{{ currentOutages.length }}</span> </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': activeTab === 'future'}" v-on:click="activeTab='future'"
           href="#">Future <span class="badge bg-light text-dark" v-if="futureOutages">{{ futureOutages.length }}</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': activeTab === 'past'}" v-on:click="activeTab='past'"
           href="#">Past <span class="badge bg-light text-dark"
                               v-if="pastOutagesPagination">{{ pastOutagesPagination.count }}</span></a>
      </li>
    </ul>

    <div class="w-100 p-2" v-if="activeTab === 'current'">
      <h1 class="w-100 text-center">Current</h1>

      <template v-if="currentOutages && currentOutages.length > 0">
        <div class="m-3 w-100" v-for="(event, eventIndex) in currentOutages" :key="eventIndex">
          <div class="bg-light text-dark p-5 h-100">
            <h3>{{ event.title }}</h3>
            <div class="w-100 p-1">
              <strong>{{ event.type }} of : </strong>
              <div class="w-100 pb-2 d-inline">
                    <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                          class="badge bg-dark m-1">{{ resource }}</span>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="p-1">
                <strong>Start : </strong>
                {{ event.start }}
              </div>
              <div class="p-1">
                <strong>End : </strong>
                {{ event.end }}
              </div>
            </div>
            <div class="w-100 pb-2">
                  <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                        class="badge bg-dark m-1">{{ resource }}</span>
            </div>
            <div class="w-100">
              <div class="w-100">{{ event.description }}</div>
              <div class="w-100" v-html="event.content"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div>No outages to display.</div>
      </template>
    </div>

    <div class="w-100 p-2" v-if="activeTab === 'future'">
      <h1 class="w-100 text-center">Future</h1>

      <template v-if="futureOutages && futureOutages.length > 0">
        <div class="m-3 w-100" v-for="(event, eventIndex) in futureOutages" :key="eventIndex">
          <div class="bg-light text-dark p-5 h-100">
            <h3>{{ event.title }}</h3>
            <div class="w-100 p-1">
              <strong>{{ event.type }} of : </strong>
              <div class="w-100 pb-2 d-inline">
                    <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                          class="badge bg-dark m-1">{{ resource }}</span>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="p-1">
                <strong>Start : </strong>
                {{ event.start }}
              </div>
              <div class="p-1">
                <strong>End : </strong>
                {{ event.end }}
              </div>
            </div>
            <div class="w-100">
              <div class="w-100">{{ event.description }}</div>
              <div class="w-100" v-html="event.content"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div>No outages to display.</div>
      </template>
    </div>

    <div class="w-100 p-2" v-if="activeTab === 'past'">
      <h1 class="w-100 text-center">Past</h1>
      <div class="w-100 d-flex flex-row">
        <label for="pastOutagesPageSize" class="p-3">Show</label>
        <select id="pastOutagesPageSize" v-model="pastOutagesPagination.pageSize" class="form-select"
                v-on:change="fetchPastOutages({page: 1})"
                aria-label="Number of entries to display" style="max-width: 100px">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <div class="text-end p-3">Showing {{ pastOutages.length }} result(s).</div>
      </div>


      <template v-if="pastOutages && pastOutages.length > 0">
        <div class="m-3 w-100" v-for="(event, eventIndex) in pastOutages" :key="eventIndex">
          <div class="bg-light text-dark p-5 h-100">
            <h3>{{ event.title }}</h3>
            <div class="w-100 p-1">
              <strong>{{ event.type }} of : </strong>
              <div class="w-100 pb-2 d-inline">
                    <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                          class="badge bg-dark m-1">{{ resource }}</span>
              </div>
            </div>
            <div class="d-flex flex-row">
              <div class="p-1">
                <strong>Start : </strong>
                {{ event.start }}
              </div>
              <div class="p-1">
                <strong>End : </strong>
                {{ event.end }}
              </div>
            </div>
            <div class="w-100">
              <div class="w-100">{{ event.description }}</div>
              <div class="w-100" v-html="event.content"></div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div>No outages to display.</div>
      </template>

      <div class="p-2">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" :class="{'disabled':!pastOutagesPagination.previous}"
                 v-on:click="fetchPastOutages({url: pastOutagesPagination.previous})">Previous</a></li>
            <li class="page-item"
                v-for="(selectedPage, selectedPageIndex) in selectedPaginationPages(pastOutagesPagination)"
                :key="selectedPageIndex">
              <a class="page-link disabled" v-if="selectedPage === null">...</a>
              <a class="page-link" :class="{'active': selectedPage === pastOutagesPagination.page}"
                 v-else v-on:click="fetchPastOutages({page: selectedPage})"
              >{{ selectedPage }}</a>
            </li>
            <li class="page-item">
              <a class="page-link" :class="{'disabled':!pastOutagesPagination.next}"
                 v-on:click="fetchPastOutages({url: pastOutagesPagination.next})">Next</a></li>
          </ul>
        </nav>
      </div>
    </div>


  </div>
</template>

<script>
import 'vue-cal/dist/vuecal.css';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';
import {inRange} from "eslint-plugin-vue/lib/utils";

const timeZoneString = Intl.DateTimeFormat().resolvedOptions().timeZone
export default {
  data() {
    return {
      pastOutagesPagination: {
        pageSize: 10,
        page: 1,
        count: 0,
        pageCount: 0,
        next: null,
        previous: null
      },
      pastOutages: [],
      currentOutages: [],
      futureOutages: [],

      activeTab: null
    }
  },

  methods: {
    setDefaultTabSelected() {
      if (this.currentOutages && this.currentOutages.length > 0) {
        this.activeTab = "current";
      } else if (this.futureOutages && this.futureOutages.length > 0) {
        this.activeTab = "future";
      } else if (this.pastOutages && this.pastOutages.length > 0) {
        this.activeTab = "past";
      } else {
        this.activeTab = "current";
      }
    },
    inRange,
    responseMapFunction(news) {
      return {
        title: news.Subject,
        content: news.Content,
        type: news.OutageType,
        resources: news.AffectedResources.map(({ResourceID}) => ResourceID),
        start: moment(String(new Date(news.OutageStart))).tz(timeZoneString).format('MM/DD/YYYY hh:mm A zz'),
        end: moment(String(new Date(news.OutageEnd))).tz(timeZoneString).format('MM/DD/YYYY hh:mm A zz'),
      };
    },
    async fetchPastOutages({url = null, page = null} = {}) {
      if (!url) {
        url = `${import.meta.env.VITE_OPERATIONS_API_URL}/wh2/news/v1/affiliation/access-ci.org/past_outages/?`;
        console.log("this.pastOutagesPagination : ", this.pastOutagesPagination);

        if (page) {
          url += `page=${page}&`;
        } else {
          url += `page=${this.pastOutagesPagination.page}&`;
        }

        url += `page_size=${this.pastOutagesPagination.pageSize}&`;
      }

      const pastOutagesResponse = await axios.get(url);

      this.pastOutagesPagination.page = pastOutagesResponse.data.page;
      this.pastOutagesPagination.pageSize = pastOutagesResponse.data.page_size;
      this.pastOutagesPagination.count = pastOutagesResponse.data.count;
      this.pastOutagesPagination.pageCount = Math.ceil(this.pastOutagesPagination.count / this.pastOutagesPagination.pageSize);
      this.pastOutagesPagination.next = pastOutagesResponse.data.next;
      this.pastOutagesPagination.previous = pastOutagesResponse.data.previous;

      this.pastOutages = pastOutagesResponse.data.results.map(this.responseMapFunction);
    },
    async fetchCurrentOutages() {
      const currentOutagesResponse = await axios.get(
          `${import.meta.env.VITE_OPERATIONS_API_URL}/wh2/news/v1/affiliation/access-ci.org/current_outages/`
      );
      this.currentOutages = currentOutagesResponse.data.results.map(this.responseMapFunction);
    },
    async fetchFutureOutages() {
      const futureOutagesResponse = await axios.get(
          `${import.meta.env.VITE_OPERATIONS_API_URL}/wh2/news/v1/affiliation/access-ci.org/future_outages/`
      );
      this.futureOutages = futureOutagesResponse.data.results.map(this.responseMapFunction);
    },
    selectedPaginationPages(pagination) {
      const from = Math.max(1, pagination.page - 5);
      const to = Math.min(pagination.pageCount, pagination.page + 5);

      const paginationPages = [];
      if (from > 1) {
        paginationPages.push(null);
      }
      for (let i = from; i <= to; i++) {
        paginationPages.push(i)
      }
      if (to < pagination.pageCount) {
        paginationPages.push(null);
      }

      return paginationPages;
    }
  },


  async created() {
    try {

      await Promise.all([
        this.fetchPastOutages(),
        this.fetchCurrentOutages(),
        this.fetchFutureOutages()
      ])

      this.setDefaultTabSelected();

    } catch (error) {
      console.error(error);
    }
  },
  watch: {
    // pastOutagesPageSize() {
    //   this.pastOutagesPageNo = 1;
    // },
    // pastOutagesPageNo() {
    //   this.fetchPastOutages();
    // }
  }
}
</script>

<style scoped>
.bg-dark {
  background-color: #1A5B6E !important;
}

.bg-light {
  background-color: #ECF9F8 !important;
}

.nav-link {
  color: #138597;
}

.nav-link.active {
  color: white;
  background-color: #138597;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  --bs-table-accent-bg: #ECF9F8 !important;
}

.page-link {
  color: #138597;
}

.page-link.active {
  z-index: 3;
  color: white;
  background-color: #138597;
  border-color: #138597;
}
</style>
