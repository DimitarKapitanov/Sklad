import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import {
  Container,
  Grid,
  Loader,
  Segment
} from "semantic-ui-react";
import { PagingParams } from "../../../app/models/pagination";
import { useStore } from "../../../app/stores/store";
import PartnerItemsPlaceholder from "./PartnerItemsPlaceholder";
import PartnerTable from "./PartnerTable";
import PartnersActions from "./PartnersActions";

export default observer(function PartnerDashboard() {
  const { partnerStore } = useStore();
  const {
    loadPartners,
    partnerRegistry,
    loadingInitial,
    // clearSelectedPartner,
    setPagingParams, partnerDashboardPagination
  } = partnerStore;

  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    if (partnerDashboardPagination) {
      setLoadingNext(true);
      setPagingParams(new PagingParams(partnerDashboardPagination.currentPage + 1));
      loadPartners().then(() => setLoadingNext(false));
    }
  }

  useEffect(() => {
    if (partnerRegistry.size < 1) loadPartners();
  }, [loadPartners, partnerRegistry.size]);

  return (
    <Container fluid style={{ marginTop: 40 }}>
      <PartnersActions />
      <Segment>
        <Grid className="partners">
          <Grid.Column width={16}>
            {loadingInitial && !loadingNext ? (
              <>
                <PartnerItemsPlaceholder />
              </>
            ) : (
              <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNext}
                hasMore={!loadingNext && !!partnerDashboardPagination && partnerDashboardPagination.currentPage < partnerDashboardPagination.totalPages}
                initialLoad={false}
              >
                <PartnerTable />
              </InfiniteScroll>
            )}
            <Grid.Column width='16'>
              <Loader active={loadingNext} />
            </Grid.Column>
          </Grid.Column>
        </Grid>
      </Segment>
    </Container>
  );
});
