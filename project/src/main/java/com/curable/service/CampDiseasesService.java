package com.curable.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.curable.domain.CampDisease;
import com.curable.repository.CampDiseasesRepository;
import com.curable.service.dto.CampDiseasesDTO;
import com.curable.service.mapper.CampDiseaseMapper;

@Service
@Transactional
public class CampDiseasesService {

	@Autowired
	private CampDiseasesRepository campDiseasesRepository;

	// @Autowired
	private final CampDiseaseMapper campDiseasesMapper;

	public CampDiseasesService(CampDiseaseMapper campDiseasesMapper) {
		this.campDiseasesMapper = campDiseasesMapper;
	}

	public List<CampDiseasesDTO> getAll() {
		return campDiseasesRepository.findAll().stream().map(campDiseasesMapper::toDto)
				.collect(Collectors.toCollection(LinkedList::new));
	}

	public Optional<CampDiseasesDTO> findBy(Long id) {
		// log.debug("Request to get CampDiseases : {}", id);
		return campDiseasesRepository.findById(id).map(campDiseasesMapper::toDto);
	}

	public CampDiseasesDTO save(CampDiseasesDTO campDiseasesDTO) {
		// log.debug("Request to save CampDiseases : {}", campDiseasesDTO);
		CampDisease campDiseases = campDiseasesMapper.toEntity(campDiseasesDTO);
		campDiseases = campDiseasesRepository.save(campDiseases);
		CampDiseasesDTO result = campDiseasesMapper.toDto(campDiseases);
		return result;
	}

	public List<CampDiseasesDTO> findByCamp_IdAndIsRecordDeletedFalse(Long campId) {
		// log.debug("Request to get CampDiseases : {}", campId);
		return campDiseasesRepository.findByCamp_IdAndIsRecordDeletedFalse(campId).stream()
				.map(campDiseasesMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
	}

	public List<CampDiseasesDTO> findByDiseaseTestMaster_IdAndIsRecordDeletedFalse(Long diseaseTestMasterId) {
		// log.debug("Request to get CampDiseases : {}", diseaseTestMasterId);
		return campDiseasesRepository.findByDiseaseTestMaster_IdAndIsRecordDeletedFalse(diseaseTestMasterId).stream()
				.map(campDiseasesMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
	}

	public void delete(Long id) {
		// log.debug("Request to delete : {}",id );
		campDiseasesRepository.deleteById(id);
	}
}
