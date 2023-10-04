<template>
  <div class="infrastructure-news-container w-100 p-2">
    <div class="w-100 p-2">
      <h1 class="w-100 text-center">Current</h1>
      <table class="w-100 table table-responsive-lg">
        <thead>
        <tr>
          <th>Event</th>
          <th>Resource</th>
          <th>Summary</th>
          <th>Type</th>
          <th>Start</th>
          <th>End</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="currentOutages && currentOutages.length > 0">
          <tr v-for="(event, eventIndex) in currentOutages" :key="eventIndex">
            <td>{{ event.title }}</td>
            <td>
              <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                    class="badge bg-secondary">{{ resource }}</span>
            </td>
            <td>
              <div>{{ event.description }}</div>
              <div v-html="event.content"></div>
            </td>
            <td>{{ event.type }}</td>
            <td>{{ event.start }}</td>
            <td>{{ event.end }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="6" class="text-center text-secondary">No outages to display.</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <div class="w-100 p-2">
      <h1 class="w-100 text-center">Future</h1>
      <table class="w-100 table table-responsive-lg">
        <thead>
        <tr>
          <th>Event</th>
          <th>Resource</th>
          <th>Summary</th>
          <th>Type</th>
          <th>Start</th>
          <th>End</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="futureOutages && futureOutages.length > 0">
          <tr v-for="(event, eventIndex) in futureOutages" :key="eventIndex">
            <td>{{ event.title }}</td>
            <td>
              <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                    class="badge bg-secondary">{{ resource }}</span>
            </td>
            <td>
              <div>{{ event.description }}</div>
              <div v-html="event.content"></div>
            </td>
            <td>{{ event.type }}</td>
            <td>{{ event.start }}</td>
            <td>{{ event.end }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="6" class="text-center text-secondary">No outages to display.</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <div class="w-100 p-2">
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
        <div class="text-end p-3">Showing {{pastOutages.length}} result(s).</div>
      </div>
      <table class="w-100 table table-responsive-lg table-striped overflow-auto" style="max-height: 500px;">
        <thead>
        <tr>
          <th>Event</th>
          <th>Resource</th>
          <th>Summary</th>
          <th>Type</th>
          <th>Start</th>
          <th>End</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="pastOutages && pastOutages.length > 0">
          <tr v-for="(event, eventIndex) in pastOutages" :key="eventIndex">
            <td>{{ event.title }}</td>
            <td>
              <span v-for="(resource, resourceIndex) in event.resources" :key="resourceIndex"
                    class="badge bg-secondary">{{ resource }}</span>
            </td>
            <td>
              <div>{{ event.description }}</div>
              <div v-html="event.content"></div>
            </td>
            <td>{{ event.type }}</td>
            <td>{{ event.start }}</td>
            <td>{{ event.end }}</td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td colspan="6" class="text-center text-secondary">No outages to display.</td>
          </tr>
        </template>
        </tbody>
      </table>
    </div>

    <div class="p-2">
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" :class="{'disabled':!pastOutagesPagination.previous}"
               v-on:click="fetchPastOutages({url: pastOutagesPagination.previous})">Previous</a></li>
          <li class="page-item" v-for="(selectedPage, selectedPageIndex) in selectedPaginationPages(pastOutagesPagination)" :key="selectedPageIndex">
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
</template>

<script>
import 'vue-cal/dist/vuecal.css';
import axios from 'axios';
import {inRange} from "eslint-plugin-vue/lib/utils";

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
      futureOutages: []
    }
  },

  methods: {
    inRange,
    responseMapFunction(news) {
      return {
        title: news.Subject,
        content: news.Content,
        type: news.NewsType,
        resources: news.AffectedResources.map(({ResourceID}) => ResourceID),
        start: new Date(news.NewsStart),
        end: new Date(news.NewsEnd)
      };
    },
    async fetchPastOutages({url = null, page= null} = {}) {
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
      for (let i = from;i<=to;i++) {
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

</style>
