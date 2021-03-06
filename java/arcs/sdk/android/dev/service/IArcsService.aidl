package arcs.sdk.android.dev.service;

import arcs.sdk.android.dev.service.IRemoteOutputCallback;
import arcs.sdk.android.dev.service.IRemotePecCallback;

import java.util.List;

/**
  * This interface allows apps to communicate with ArcsService.
  */
interface IArcsService {
  // TODO: Define a nicer service API that more clearly reflects particle lifecycles,
  // e.g. attachPec, unattachPec, etc.
  void sendMessageToArcs(String message);

  void startArc(
      String arcId,
      String pecId,
      String recipe,
      // TODO: use Parcelable for ParticleData (and/or the entire ArcData).
      in List<String> particleIds,
      in List<String> particleNames,
      in List<String> providedSlotIds,
      IRemotePecCallback callback);

  void stopArc(String arcId, String pecId);

  // TODO: add unregisterRenderer method.
  void registerRenderer(String modality, IRemoteOutputCallback callback);
}

